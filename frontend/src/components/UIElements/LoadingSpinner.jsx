import React from "react";
import "./LoadingSpinner.css"; // Assurez-vous que le chemin d'accès est correct

const Spinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <div className="spinner">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/013/362/736/small/football-soccer-transparent-free-png.png"
        alt="Loading"
      />
    </div>
  </div>
);

export default Spinner;
