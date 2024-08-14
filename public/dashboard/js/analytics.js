import Main from '../../frontend/main.js';

class Analytics {

  orders = [];
  tabsContainer;
  constructor() {



    // Sample data representing the number of orders per month
    // this.orders = [
    //   { date: new Date('2024-01-15'), total: 100 },
    //   { date: new Date('2024-01-20'), total: 200 },
    //   { date: new Date('2024-02-05'), total: 150 },
    //   { date: new Date('2024-03-22'), total: 250 },
    //   { date: new Date('2024-03-25'), total: 300 },
    //   { date: new Date('2024-04-10'), total: 100 },
    //   { date: new Date('2024-05-12'), total: 400 },
    //   { date: new Date('2024-06-15'), total: 350 },
    //   { date: new Date('2024-06-18'), total: 150 },
    //   { date: new Date('2024-06-22'), total: 200 },
    //   { date: new Date('2024-07-02'), total: 250 },
    //   { date: new Date('2024-07-19'), total: 300 },
    //   { date: new Date('2024-08-08'), total: 400 },
    // ];

    this.tabsContainer = document.querySelector('.tabs-container');

    this.initAnalyticsEventListeners();
    this.renderCharts();

    // this.renderRevenueChart(this.orders);
    // this.renderOrdersChart(this.orders);
  }

  initAnalyticsEventListeners() {
    this.tabsContainer.addEventListener('click', this.handleTabClick.bind(this));
  }

  handleTabClick(e) {

    const charts = [...document.querySelectorAll('.chart')];
    const tabs = [...document.querySelectorAll('.tab')];
    if (e.target.classList.contains('active'))
      return;

    if (e.target.getAttribute('data-chart') == 'revenue') {

      charts.forEach(chart => chart.classList.add('hidden'));
      document.querySelector('#revenue-chart').classList.remove('hidden');
      tabs.forEach(tab => tab.classList.remove('active'));
      e.target.closest('.tab').classList.add('active')

      return;
    }
    else if (e.target.getAttribute('data-chart') == 'orders') {
      charts.forEach(chart => chart.classList.add('hidden'));
      document.querySelector('#orders-chart').classList.remove('hidden');
      tabs.forEach(tab => tab.classList.remove('active'));
      e.target.closest('.tab').classList.add('active')
      return;

    }


  }


  async renderCharts() {
    try {
      // Fetch all orders from the server
      const response = await fetch('/api/orders/asc');
      if (!response.ok) throw new Error('Failed to fetch orders');

      const { data: orders } = await response.json();

      // Now you have all orders data, you can use it to render the charts
      this.renderOrdersChart(orders);
      this.renderRevenueChart(orders);
    } catch (error) {
      console.error('Error loading orders for charts:', error);
    }
  }

  // Function to render the orders chart
  renderOrdersChart(orders) {
    const ordersByMonth = d3.rollup(
      orders,
      v => v.length,
      d => d3.timeFormat("%B")(new Date(d.createdAt))
    );

    const data = Array.from(ordersByMonth, ([month, count]) => ({ month, count }));

    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#orders-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, Math.ceil(d3.max(data, d => d.count))])
      .nice()
      .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(data.length));

    const yMax = Math.ceil(d3.max(data, d => d.count));
    svg.append("g")
      .call(d3.axisLeft(y).ticks(yMax).tickFormat(d3.format("d")));

    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", "steelblue");

    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.month) + x.bandwidth() / 2)
      .attr("y", d => y(d.count) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.count);
  }

  // Function to render the revenue chart
  renderRevenueChart(orders) {
    // Group orders by month and calculate total revenue for each month
    const revenueByMonth = d3.rollup(
      orders,
      v => d3.sum(v, d => parseFloat(d.total)),
      d => d3.timeFormat("%B")(new Date(d.createdAt))
    );

    const data = Array.from(revenueByMonth, ([month, total]) => ({ month, total }));

    const margin = { top: 20, right: 30, bottom: 40, left: 80 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#revenue-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total)])
      .nice()
      .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10));

    const yAxis = d3.axisLeft(y)
      .ticks(10) // Set the number of ticks to 10 to avoid overcrowding
      .tickFormat(d3.format("~s")); // Format ticks with SI prefixes (e.g., k for thousand)

    svg.append("g")
      .call(yAxis);

    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.total))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.total))
      .attr("fill", "green");

    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.month) + x.bandwidth() / 2)
      .attr("y", d => y(d.total) - 5)
      .attr("text-anchor", "middle")
      .text(d => `$${d.total.toFixed(2)}`);
  }


}

Main.initComponents([Analytics]);
Main.hidePreLoader();