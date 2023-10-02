function formattable(file, id) {
  d3.csv(file, function(data) {
      var table = d3.select('#' + id)
                    .append('table')
                    .classed('table', true)
                    .classed('table-striped', true)
      var columns = d3.keys(data[0]);
      var thead = table.append('thead')
      var tbody = table.append('tbody')
    
      thead.append('tr')
        .selectAll('th')
          .data(columns)
          .enter()
        .append('th')
          .attr('scope', 'col')
          .text(function (d) { return d })

      var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
        .append('tr')

      var cells = rows.selectAll('td')
          .data(function(row) {
            return columns.map(function (column) {
              return {column: column, value: row[column]}
            })
          })
          .enter()
          .append('td')
          .html(function (d) { 
            return d.value})
  });
}