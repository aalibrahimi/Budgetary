import Plotly from 'plotly.js-dist'
import { useEffect, useState } from 'react'
import '../assets/expenses.css'

const Graphs = () => {
  const [expenses, setExpenses] = useState<any[]>(() => {
    // State to store the list of expenses. The initial value is loaded from `localStorage` if available.
    const savedExpenses = localStorage.getItem('expenses') // This looks for the saved expenses in the local storage
    return savedExpenses ? JSON.parse(savedExpenses) : []
    // If expenes exist in local we parse them (convert from string to Object)
  })
  // use effect for the graph, we will start with showing the default bar graph
  useEffect(() => {
    updateGraph('bar') //Default graph type
  }, [])

  const updateGraph = (graphType: string) => {
    if (expenses.length === 0) {
      Plotly.newPlot('graphContainer', [], {
        title: 'No Expenses to Display'
      })
      return
    }
    const categories = expenses.map((expense) => expense.category)
    const amounts = expenses.map((expense) => expense.amount)

    const data =
      graphType === 'pie'
        ? [
            {
              values: amounts,
              labels: categories,
              type: 'pie'
            }
          ]
        : [
            {
              x: categories,
              y: amounts,
              type: graphType //"bar" or "line"
            }
          ]

    Plotly.newPlot('graphContainer', data, {
      // this Segment is where it displays the graph on the app
      title: `<b>Spending Overview</b><br> <span style= "font-size: 16px;">Month: </span>`,
      xaxis: { title: 'Categories' },
      yaxis: { title: 'Amount ($)' }
    })
  }

  return (
    <>
      {/* graph section Here */}
      {/* for each tab, you would need to wrap it in an activeTab code and the contents under it */}
      <div id="graphs" className="tab-content">
        <h2>Spending Graphs</h2>
        <select title='graph-select' onChange={(e) => updateGraph(e.target.value)} className="graph-select">
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="line">Line Chart</option>
        </select>
        <div id="graphContainer"></div>
      </div>
    </>
  )
}

export default Graphs
