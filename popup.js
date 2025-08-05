document.addEventListener('DOMContentLoaded', () => {
  const saleInput = document.getElementById('sale');
  const hoursInput = document.getElementById('hours');
  const partsCostInput = document.getElementById('partsCost');

  // Restore previous values if present
  chrome.storage.local.get(['lastSale', 'lastHours', 'lastParts'], (data) => {
    if (data.lastSale !== undefined) saleInput.value = data.lastSale;
    if (data.lastHours !== undefined) hoursInput.value = data.lastHours;
    if (data.lastParts !== undefined) partsCostInput.value = data.lastParts;
  });

  document.getElementById('jobForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const sale = parseFloat(saleInput.value) || 0;
    const hours = parseFloat(hoursInput.value) || 0;
    const partsCost = parseFloat(partsCostInput.value) || 0;

    // Save current entries
    chrome.storage.local.set({
      lastSale: sale,
      lastHours: hours,
      lastParts: partsCost
    });

    chrome.storage.sync.get(
      {
        gpPercentThreshold: 60,
        ohch: 110,
        techCostPerHour: 70,
        gpHrBufferPercent: 25
      },
      (settings) => {
        const techCost = settings.techCostPerHour * hours;
        const overheadCost = settings.ohch * hours;
        const totalCost = techCost + partsCost;
        const grossProfit = sale - totalCost;

        const gpPercent = ((grossProfit / sale) * 100).toFixed(2);
        const gpPerHour = (grossProfit / hours).toFixed(2);
        const gpHrThreshold = settings.ohch * (1 + settings.gpHrBufferPercent / 100);

        // Update UI
        const gpEl = document.getElementById('gp');
        const gpPctEl = document.getElementById('gpPercent');
        const gpHrEl = document.getElementById('gpPerHour');
        const alertEl = document.getElementById('alert');
        const thresholdEl = document.getElementById('thresholdDisplay');
        const totalOverheadDisplay = document.getElementById('overheadDisplay');

        gpEl.textContent = `$${grossProfit.toFixed(2)}`;
        gpEl.className = grossProfit >= overheadCost ? 'greenText' : 'redText';

        gpPctEl.textContent = `${gpPercent}%`;
        gpPctEl.className = parseFloat(gpPercent) < settings.gpPercentThreshold ? 'redText' : 'greenText';

        gpHrEl.textContent = `$${gpPerHour}`;
        gpHrEl.className = parseFloat(gpPerHour) < gpHrThreshold ? 'redText' : 'greenText';

        thresholdEl.textContent = `Minimum GP/HR Target: $${gpHrThreshold.toFixed(2)}`;
        totalOverheadDisplay.textContent = `Total Overhead Cost: $${overheadCost.toFixed(2)}`;

        alertEl.style.display = (parseFloat(gpPercent) < settings.gpPercentThreshold && parseFloat(gpPerHour) < gpHrThreshold)
          ? 'block'
          : 'none';
      }
    );
  });
});
