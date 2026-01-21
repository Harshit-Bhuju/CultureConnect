import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const TopPerformingCourses = ({ selectedPeriod, topCourses, loading }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (
      !chartRef.current ||
      loading ||
      !topCourses ||
      topCourses.length === 0
    ) {
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: topCourses.map((c) => c.title),
        datasets: [
          {
            label:
              selectedPeriod === "This month"
                ? "Students Enrolled this month"
                : selectedPeriod === "This year"
                  ? "Students Enrolled this year"
                  : "Total Students",
            data: topCourses.map((c) => c.students),
            backgroundColor: "#2d3748",
            borderRadius: 4,
            barThickness: 24,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a202c",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.x} students`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
          y: {
            ticks: {
              color: "#4a5568",
              font: { size: 12 },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [topCourses, selectedPeriod, loading]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full">
        <div
          className="flex justify-center items-center"
          style={{ height: "400px" }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  if (!topCourses || topCourses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 h-full">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Top Performing Courses
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedPeriod === "This month"
              ? "Performance this month"
              : selectedPeriod === "This year"
                ? "Performance this year"
                : "Total performance"}
          </p>
        </div>
        <div
          className="flex justify-center items-center"
          style={{ height: "400px" }}>
          <div className="text-center">
            <p className="text-gray-500 font-medium">No data available</p>
            <p className="text-sm text-gray-400 mt-1">
              Start teaching to see analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate dynamic height
  const dynamicHeight = Math.min(Math.max(topCourses.length * 40, 400), 2000);
  const isScrollable = topCourses.length > 10;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">
          Top Performing Courses
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedPeriod === "This month"
            ? "Students Enrolled this month"
            : selectedPeriod === "This year"
              ? "Students Enrolled this year"
              : "Total Students"}
        </p>
        {isScrollable && (
          <p className="text-xs text-blue-600 mt-1">
            📊 Showing {topCourses.length} courses - scroll to view all
          </p>
        )}
      </div>

      <div
        className="w-full overflow-y-auto flex-1"
        style={{ maxHeight: "600px" }}>
        <div style={{ height: `${dynamicHeight}px`, minHeight: "400px" }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default TopPerformingCourses;
