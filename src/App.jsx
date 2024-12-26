import { useCallback, useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const placesPickedLocalStorage = JSON.parse(
  localStorage.getItem("places-picked")
);

let finalPickedPlaces = placesPickedLocalStorage ?? [];

finalPickedPlaces = AVAILABLE_PLACES?.filter((place) =>
  finalPickedPlaces.find((placeId) => place.id === placeId)
);

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(finalPickedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      // console.log(
      //   position,
      //   "position",
      //   sortedPlaces,
      //   "sorted places ",
      //   AVAILABLE_PLACES
      // );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setIsModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsModalOpen(false);
    // modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const placesPickedLocalStorage = JSON.parse(
      localStorage.getItem("places-picked")
    );

    let finalPickedPlaces = placesPickedLocalStorage ?? [];

    if (!finalPickedPlaces.some((place) => place === id)) {
      localStorage.setItem(
        "places-picked",
        JSON.stringify([...finalPickedPlaces, id])
      );
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );

    const placesPickedLocalStorage = JSON.parse(
      localStorage.getItem("places-picked")
    );

    let finalPickedPlaces = placesPickedLocalStorage ?? [];

    localStorage.setItem(
      "places-picked",
      JSON.stringify(
        finalPickedPlaces?.filter(
          (placeId) => placeId !== selectedPlace.current
        )
      )
    );

    setIsModalOpen(false);
    // modal.current.close();
  }, []);

  return (
    <>
      <Modal ref={modal} isOpen={isModalOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText={"Kindly wait, until fetching completes ..."}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
