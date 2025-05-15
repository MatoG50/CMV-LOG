import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface StatusPoint {
  time: string;
  status: keyof typeof statusColors;
  duration: number;
  activity?: string;
  location?: string;
}

interface LogSheet {
  day: number;
  date: string;
  start_time: string;
  end_time: string;
  entries: StatusPoint[];
  summary: {
    drive_hours: number;
    on_duty_hours: number;
    off_duty_hours: number;
    fuel_stops: number;
  };
}

interface TripData {
  log_sheets: LogSheet[];
}

const statusColors = {
  OFF: "#d4edda",
  SB: "#f8d7da",
  DR: "#d1ecf1",
  ON: "#fff3cd",
};

const ELDStatusGraph = ({ sheet }: { sheet: LogSheet }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const parseTimeToHours = (timeStr: string, baseDate: string) => {
    if (timeStr.includes("day")) {
      const [dayPart, timePart] = timeStr.split(", ");
      const days = parseInt(dayPart) || 0;
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      return days * 24 + hours + minutes / 60 + seconds / 3600;
    }
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sheet.entries.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions
    const margin = { top: 50, right: 30, bottom: 30, left: 170 };
    const graphWidth = canvas.width - margin.left - margin.right;
    const graphHeight = canvas.height - margin.top - margin.bottom;

    // Status positions
    const statusConfig = [
      { id: "OFF", label: "Off Duty", yPos: 0.15 },
      { id: "SB", label: "Sleeper Berth", yPos: 0.35 },
      { id: "DR", label: "Driving", yPos: 0.65 },
      { id: "ON", label: "On Duty (Not Driving)", yPos: 0.85 },
    ];

    const statusLevels: Record<string, number> = {};
    statusConfig.forEach(status => {
      statusLevels[status.id] = margin.top + graphHeight * status.yPos;
    });

    // Calculate day’s time window
    const dayStartHours = parseTimeToHours(sheet.start_time, sheet.date);
    const dayEndHours = parseTimeToHours(sheet.end_time, sheet.date);
    const dayDuration = Math.min(dayEndHours - dayStartHours, 24); // Cap at 24 hours for display

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid background
    ctx.fillStyle = "#f9f9f9";
    ctx.fillRect(margin.left, margin.top, graphWidth, graphHeight);

    // Vertical hour lines + labels
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";

    const startHour = Math.floor(dayStartHours % 24);
    for (let hour = 0; hour <= dayDuration; hour++) {
      const x = margin.left + (hour / dayDuration) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + graphHeight);
      ctx.stroke();
      const displayHour = ((startHour + hour) % 24).toString().padStart(2, "0");
      ctx.fillText(`${displayHour}:00`, x, margin.top - 10);
    }

    // Horizontal status lines
    ctx.strokeStyle = "#ccc";
    statusConfig.forEach(status => {
      ctx.beginPath();
      ctx.moveTo(margin.left, statusLevels[status.id]);
      ctx.lineTo(margin.left + graphWidth, statusLevels[status.id]);
      ctx.stroke();
    });

    // Status labels
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    statusConfig.forEach(status => {
      ctx.fillText(status.label, margin.left - 10, statusLevels[status.id] + 5);
    });

    // Draw timeline
    ctx.lineWidth = 3;
    ctx.beginPath();

    sheet.entries.forEach((point, i) => {
      const totalHours = parseTimeToHours(point.time, sheet.date);
      const relativeHours = totalHours - dayStartHours;
      if (relativeHours < 0 || relativeHours > dayDuration) return; // Skip out-of-bounds events
      const x = margin.left + (relativeHours / dayDuration) * graphWidth;
      const y = statusLevels[point.status];

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prev = sheet.entries[i - 1];
        const prevTotalHours = parseTimeToHours(prev.time, sheet.date);
        const prevRelativeHours = prevTotalHours - dayStartHours;
        if (prevRelativeHours < 0 || prevRelativeHours > dayDuration) return;
        const prevX =
          margin.left + (prevRelativeHours / dayDuration) * graphWidth;
        const prevY = statusLevels[prev.status];

        // Fill status block
        ctx.fillStyle = statusColors[prev.status] || "#ccc";
        ctx.fillRect(prevX, prevY - 5, x - prevX, 10);

        // Timeline lines
        ctx.lineTo(x, prevY);
        ctx.lineTo(x, y);
      }
    });

    // Final segment
    const last = sheet.entries[sheet.entries.length - 1];
    const lastTotalHours = parseTimeToHours(last.time, sheet.date);
    const lastRelativeHours = lastTotalHours - dayStartHours;
    if (lastRelativeHours <= dayDuration) {
      const lastX =
        margin.left + (lastRelativeHours / dayDuration) * graphWidth;
      const finalX = margin.left + graphWidth;
      const finalY = statusLevels[last.status];

      ctx.fillStyle = statusColors[last.status] || "#ccc";
      ctx.fillRect(lastX, finalY - 5, finalX - lastX, 10);
      ctx.lineTo(finalX, finalY);
      ctx.stroke();
    }

    // Add tooltips (simplified hover effect)
    canvas.onmousemove = e => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      ctx.clearRect(0, 0, margin.left - 10, canvas.height); // Clear tooltip area
      sheet.entries.forEach(point => {
        const totalHours = parseTimeToHours(point.time, sheet.date);
        const relativeHours = totalHours - dayStartHours;
        if (relativeHours < 0 || relativeHours > dayDuration) return;
        const x = margin.left + (relativeHours / dayDuration) * graphWidth;
        const y = statusLevels[point.status];

        if (Math.abs(mouseX - x) < 10 && Math.abs(mouseY - y) < 10) {
          ctx.font = "12px Arial";
          ctx.fillStyle = "#333";
          ctx.textAlign = "left";
          ctx.fillText(
            `${point.activity || point.status} (${point.location || "N/A"})`,
            margin.left - 160,
            margin.top + 20
          );
        }
      });
    };
  }, [sheet]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={300}
        style={{
          display: "block",
          margin: "20px auto",
          border: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      />
    </div>
  );
};

const ELDLogGraph = ({ tripId }: { tripId: number }) => {
  const [logSheets, setLogSheets] = useState<LogSheet[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  useEffect(() => {
    if (tripId === null) return; // Early exit if tripId is null
    console.log("Fetching ELD logs for tripId:", tripId);

    const fetchData = async () => {
      try {
        const res = await axios.get<TripData>(
          `http://127.0.0.1:8000/trips/${tripId}/route`
        );
        console.log("Full API Response:", res.data);

        if (
          Array.isArray(res.data.log_sheets) &&
          res.data.log_sheets.length > 0
        ) {
          console.log("Setting logSheets state:", res.data.log_sheets);
          setLogSheets(res.data.log_sheets);
          setCurrentSheetIndex(0);
        } else {
          console.warn("No log sheets found for tripId:", tripId);
        }
      } catch (error) {
        console.error("Error fetching ELD logs:", error);
      }
    };

    fetchData();
  }, [tripId]);

  if (!tripId || logSheets.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {logSheets.map((sheet, index) => (
          <button
            key={sheet.day}
            onClick={() => setCurrentSheetIndex(index)}
            style={{
              fontWeight: currentSheetIndex === index ? "bold" : "normal",
              padding: "5px 10px",
            }}
          >
            Day {sheet.day} ({sheet.date})
          </button>
        ))}
      </div>
      <ELDStatusGraph sheet={logSheets[currentSheetIndex]} />
    </div>
  );
};

export default ELDLogGraph;
