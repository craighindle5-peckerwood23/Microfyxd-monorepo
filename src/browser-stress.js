// Browser Stress Test for Microfyxd
// Hammer /api/cognition/meta-audit and /api/cognition/self-heal

function hammerMicrofyxd(requestsPerBatch = 100, intervalMs = 50) {
    console.log("Starting browser stress test...");

    setInterval(() => {
        for (let i = 0; i < requestsPerBatch; i++) {
            fetch("/api/cognition/meta-audit").catch(() => { });
            fetch("/api/cognition/self-heal").catch(() => { });
        }
        console.log(`Sent ${requestsPerBatch * 2} requests`);
    }, intervalMs);
}

console.log("Load this file in your browser console and run:");
console.log("hammerMicrofyxd()");