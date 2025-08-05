document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({ gpPercentThreshold: 60, ohch: 110, techCostPerHour: 70, gpHrBufferPercent: 25 }, (settings) => {
    document.getElementById('gpThreshold').value = settings.gpPercentThreshold;
    document.getElementById('ohch').value = settings.ohch;
    document.getElementById('techCost').value = settings.techCostPerHour;
    document.getElementById('gpHrBufferPercent').value = settings.gpHrBufferPercent;
  });

  document.getElementById('save').addEventListener('click', () => {
    const percentValue = parseFloat(document.getElementById('gpThreshold').value) || 60;
    const ohchValue = parseFloat(document.getElementById('ohch').value) || 110;
    const techCostValue = parseFloat(document.getElementById('techCost').value) || 70;
    const gpHrBufferValue = parseFloat(document.getElementById('gpHrBufferPercent').value) || 25;

    chrome.storage.sync.set({
      gpPercentThreshold: percentValue,
      ohch: ohchValue,
      techCostPerHour: techCostValue,
      gpHrBufferPercent: gpHrBufferValue
    }, () => {
      document.getElementById('status').textContent = 'Settings saved.';
      setTimeout(() => document.getElementById('status').textContent = '', 2000);
    });
  });
});
