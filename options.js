document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    {
      gpPercentThreshold: 60,
      ohch: 110,
      techCostPerHour: 70,
      gpHrBufferPercent: 25
    },
    (settings) => {
      document.getElementById('gpThreshold').value = settings.gpPercentThreshold;
      document.getElementById('ohch').value = settings.ohch;
      document.getElementById('techCost').value = settings.techCostPerHour;
      document.getElementById('gpHrBufferPercent').value = settings.gpHrBufferPercent;
    }
  );

  document.getElementById('save').addEventListener('click', () => {
    const percentInput = document.getElementById('gpThreshold').value;
    const ohchInput = document.getElementById('ohch').value;
    const techCostInput = document.getElementById('techCost').value;
    const gpHrBufferInput = document.getElementById('gpHrBufferPercent').value;

    const percentValue = percentInput !== '' ? parseFloat(percentInput) : 60;
    const ohchValue = ohchInput !== '' ? parseFloat(ohchInput) : 110;
    const techCostValue = techCostInput !== '' ? parseFloat(techCostInput) : 70;
    const gpHrBufferValue = gpHrBufferInput !== '' ? parseFloat(gpHrBufferInput) : 25;

    chrome.storage.sync.set(
      {
        gpPercentThreshold: percentValue,
        ohch: ohchValue,
        techCostPerHour: techCostValue,
        gpHrBufferPercent: gpHrBufferValue
      },
      () => {
        const statusEl = document.getElementById('status');
        statusEl.textContent = 'Settings saved.';
        setTimeout(() => (statusEl.textContent = ''), 2000);
      }
    );
  });
});
