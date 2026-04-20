export default async function decorate(block) {
  // Load data
  const res = await fetch('/search-data.json');
  const data = await res.json();

  // UI structure
  block.innerHTML = `
    <div class="search-ui">
      <input type="text" class="search-input" placeholder="Search..." />

      <select class="filter-region">
        <option value="">All Regions</option>
        <option value="NA">NA</option>
        <option value="EMEA">EMEA</option>
      </select>

      <select class="filter-type">
        <option value="">All Types</option>
        <option value="campaign">Campaign</option>
        <option value="asset">Asset</option>
      </select>

      <button class="search-btn">Search</button>

      <div class="results"></div>
    </div>
  `;

  const input = block.querySelector('.search-input');
  const regionFilter = block.querySelector('.filter-region');
  const typeFilter = block.querySelector('.filter-type');
  const resultsEl = block.querySelector('.results');
  const button = block.querySelector('.search-btn');

  function render(results) {
    if (!results.length) {
      resultsEl.innerHTML = '<p>No results found</p>';
      return;
    }

    resultsEl.innerHTML = results.map(item => `
      <div class="card">
        <h3><a href="${item.url}">${item.title}</a></h3>
        <p>${item.description}</p>
        <small>${item.region} | ${item.type}</small>
      </div>
    `).join('');
  }

  function search() {
    const query = input.value.toLowerCase();
    const region = regionFilter.value;
    const type = typeFilter.value;

    const filtered = data.filter(item => {
      const matchesText =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesRegion = !region || item.region === region;
      const matchesType = !type || item.type === type;

      return matchesText && matchesRegion && matchesType;
    });

    render(filtered);
  }

  button.addEventListener('click', search);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') search();
  });

  // initial render
  render(data);
}