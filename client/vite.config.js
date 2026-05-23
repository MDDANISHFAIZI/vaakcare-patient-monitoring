import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/analyze": "https://vaakcare-patient-monitoring.onrender.com",
      "/health": "https://vaakcare-patient-monitoring.onrender.com",
    },
  },
});
