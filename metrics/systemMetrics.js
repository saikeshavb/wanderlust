const fs = require("fs");
const path = require("path");

const metricsDirectory = path.join(__dirname, "..", "performance", "results");

fs.mkdirSync(metricsDirectory, { recursive: true });

const metricsFile = path.join(
    metricsDirectory,
    "system-metrics.csv"
);

if (!fs.existsSync(metricsFile)) {
    fs.writeFileSync(
        metricsFile,
        "timestamp,cpuPercent,rssMb,heapUsedMb\n"
    );
}

let previousCpuUsage = process.cpuUsage();
let previousTime = process.hrtime.bigint();

function collectSystemMetrics() {
    const currentCpuUsage = process.cpuUsage(previousCpuUsage);
    const currentTime = process.hrtime.bigint();

    const elapsedMicros =
        Number(currentTime - previousTime) / 1000;

    const cpuTimeMicros =
        currentCpuUsage.user + currentCpuUsage.system;

    const cpuPercent =
        (cpuTimeMicros / elapsedMicros) * 100;

    const memory = process.memoryUsage();

    const rssMb =
        memory.rss / 1024 / 1024;

    const heapUsedMb =
        memory.heapUsed / 1024 / 1024;

    const timestamp = new Date().toISOString();

    const line =
        `${timestamp},` +
        `${cpuPercent.toFixed(2)},` +
        `${rssMb.toFixed(2)},` +
        `${heapUsedMb.toFixed(2)}\n`;

    fs.appendFileSync(metricsFile, line);

    console.log(
        `[SYSTEM] ` +
        `CPU: ${cpuPercent.toFixed(2)}% | ` +
        `RSS: ${rssMb.toFixed(2)} MB | ` +
        `Heap Used: ${heapUsedMb.toFixed(2)} MB`
    );

    previousCpuUsage = process.cpuUsage();
    previousTime = currentTime;
}

function startSystemMetrics() {
    return setInterval(collectSystemMetrics, 5000);
}

module.exports = {
    startSystemMetrics,
    collectSystemMetrics
};