const ONE_MAP_API = "https://www.onemap.gov.sg/api/common/elastic/search";
const HDB_DATA_API = "https://data.gov.sg/api/action/datastore_search";

document.getElementById('searchBtn').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value;
  document.getElementById('searchStatus').textContent = `Searching for "${query}"...`;

  const locationData = await fetchLocation(query);
  if (!locationData) return;

  const transactions = await fetchTransactions(locationData.block, locationData.road);
  renderMap(locationData.lat, locationData.lon);
  renderTransactions(transactions);
  renderAmenities(locationData.lat, locationData.lon);
  renderTransport(locationData.lat, locationData.lon);
});

async function fetchLocation(query) {
  const url = `${ONE_MAP_API}?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
  const res = await fetch(url);
  const data = await res.json();
  const first = data.results[0];
  if (!first) return null;
  return {
    block: first.BLK_NO,
    road: first.ROAD_NAME,
    lat: first.LATITUDE,
    lon: first.LONGITUDE
  };
}

async function fetchTransactions(block, street) {
  return []; // stub
}

function renderMap(lat, lon) {
  document.getElementById('mapContainer').innerHTML = `<iframe width="100%" height="300" src="https://www.onemap.gov.sg/maps/?lat=${lat}&lng=${lon}&zoom=17"></iframe>`;
}

function renderTransactions(transactions) {
  // TODO: populate table and chart
}

function renderAmenities(lat, lon) {
  // TODO: Use OneMap or LTA APIs to pull data
}

function renderTransport(lat, lon) {
  // TODO: Use OneMap or LTA APIs to pull nearby MRT/bus stops
}
