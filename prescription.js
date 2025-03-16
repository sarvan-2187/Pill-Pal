document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("uploadForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Get input values
        const patientName = document.getElementById("patientName").value.trim();
        const doctorName = document.getElementById("doctorName").value.trim();
        const diseases = document.getElementById("diseases").value.trim();
        const medicines = document.getElementById("medicines").value.trim();

        if (!patientName || !doctorName || !diseases || !medicines) {
            alert("Please fill in all fields!");
            return;
        }

        // Create new prescription row
        const prescriptionsTable = document.getElementById("prescriptionsTable");
        const prescriptionTable = document.getElementById("prescriptionTable");
        const noPrescriptionMessage = document.getElementById("noPrescriptionMessage");

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${patientName}</td>
            <td>${doctorName}</td>
            <td>${diseases}</td>
            <td>${medicines}</td>
        `;
        prescriptionsTable.appendChild(row);

        // Show table & hide "No prescriptions" message
        noPrescriptionMessage.style.display = "none";
        prescriptionTable.style.display = "table";

        // Clear form fields after submission
        document.getElementById("uploadForm").reset();
    });
});
