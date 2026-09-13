import http from "k6/http";
import { check } from "k6";

export const options = {
    scenarios: {
        listings_concurrency: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "10s", target: 10 },
                { duration: "20s", target: 10 },

                { duration: "10s", target: 25 },
                { duration: "30s", target: 25 },

                { duration: "10s", target: 50 },
                { duration: "30s", target: 50 },
            ],
            gracefulRampDown: "5s",
        },
    },
};

export default function () {
    const response = http.get("http://localhost:8080/listings");

    check(response, {
        "status is 200": (r) => r.status === 200,
    });
}