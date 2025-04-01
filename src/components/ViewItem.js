import React from 'react';
import { useParams } from 'react-router-dom';

const ViewItem = () => {
  const { itemName } = useParams();

  // For the sake of this example, the data will be static.
  // You can replace this with data fetched from your backend later.
  const itemData = {
    itemName: itemName,
    location: "Sydney",
    date: "2025-03-29",
    description: "Found on the bus, in good condition.",
    photo: null, // If a photo was uploaded, it will be set here
  };

  return (
    <div className="view-item">
      <h1>Item Details</h1>
      <h2>{itemData.itemName}</h2>
      <p><strong>Location:</strong> {itemData.location}</p>
      <p><strong>Date:</strong> {itemData.date}</p>
      <p><strong>Description:</strong> {itemData.description}</p>
      {itemData.photo ? (
        <img src={URL.createObjectURL(itemData.photo)} alt={itemData.itemName} />
      ) : (
        <div>No photo available</div>
      )}
    </div>
  );
};

export default ViewItem;
