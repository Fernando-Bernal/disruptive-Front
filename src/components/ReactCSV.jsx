import React from 'react'
import { CSVLink } from "react-csv";
function ReactCSV(data) {
      
  return (
    <div>
        <CSVLink className="btn-csv" data={data.data} headers={data.headers} >
            Download CSV
        </CSVLink>
    </div>
  )
}

export default ReactCSV