// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// function FacialHistory({ token }) {
//   const [facialHistory, setFacialHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFacialHistory = async () => {
//       try {
//         console.log("Token:", token);
//         const response = await fetch(
//           "http://localhost:5000/api/facial/history",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch facial history.");
//         }
//         console.log(response);

//         const data = await response.json();
//         setFacialHistory(data); // Assuming the API returns an array of facial results
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFacialHistory();
//   }, [token]);

//   if (loading) {
//     return <div className="text-center mt-5">Loading...</div>;
//   }

//   if (error) {
//     return <div className="alert alert-danger text-center mt-5">{error}</div>;
//   }

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString(); // Format to display as human-readable date and time
//   };

//   return (
//     <div className="container mt-5">
//       <h1 className="text-center mb-4 text-primary">
//         Your Facial Analysis History
//       </h1>
//       <p className="text-center text-muted">
//         View the results of your past facial analysis sessions.
//       </p>

//       {facialHistory.length > 0 ? (
//         <div className="row">
//           {facialHistory.map((facial, index) => (
//             <div className="col-md-6 mb-4" key={index}>
//               <div className="card shadow-lg border-light h-100">
//                 <div className="card-body">
//                   <h5 className="card-title text-info">
//                     Depression Score: {facial.averageDepressionScore}
//                   </h5>
//                   <p className="card-text text-muted">
//                     <strong>Date Analyzed: </strong>
//                     {formatDate(facial.timestamp)}
//                   </p>
//                   <p className="card-text">
//                     <strong>Emotions Detected: </strong>
//                   </p>
//                   <ul>
//                     {facial.emotions.emotion.map((emotion, idx) => (
//                       <li key={idx} className="text-secondary">
//                         {emotion}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="alert alert-info text-center mt-4">
//           No facial analysis records available.
//         </div>
//       )}
//     </div>
//   );
// }

// export default FacialHistory;
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function FacialHistory({ token }) {
  const [facialHistory, setFacialHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacialHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/facial/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch facial history.");
        }

        const data = await response.json();
        setFacialHistory(data); // Assuming the API returns an array of facial results
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFacialHistory();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format to display as human-readable date and time
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">
        Your Facial Analysis History
      </h1>
      <p className="text-center text-muted">
        View the results of your past facial analysis sessions.
      </p>

      {facialHistory.length > 0 ? (
        <div className="row">
          {facialHistory.map((facial, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card shadow-lg border-light h-100">
                <div className="card-body">
                  <h5 className="card-title text-info">
                    Depression Score: {facial.averageDepressionScore}
                  </h5>
                  <p className="card-text text-muted">
                    <strong>Date Analyzed: </strong>
                    {formatDate(facial.timestamp)}
                  </p>
                  <p className="card-text">
                    <strong>Emotions Detected: </strong>
                  </p>
                  <ul>
                    {facial.emotions.map((emotion, idx) => (
                      <li key={idx} className="text-secondary">
                        {emotion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center mt-4">
          No facial analysis records available.
        </div>
      )}
    </div>
  );
}

export default FacialHistory;
