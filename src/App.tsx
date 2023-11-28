import { type Component, createSignal, For } from 'solid-js';
import styles from './App.module.css';
import { Countdown } from './Countdown';
import Logo from './assets/logo-squeed-v3.png';
import QR from './qr.png';

const URL = 'https://ext-api.vasttrafik.se/pr/v4';

type TokenProps = {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};

type LatLon = {
  lat: number;
  lon: number;
};

const App: Component = () => {
  const [inputData, setInputData] = createSignal('');
  const [data, setData] = createSignal(null);
  const [latLon, setLatLon] = createSignal<LatLon | null>(null);
  const [loading, setLoading] = createSignal(false);

  const getLatLong = async () => {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${inputData()}`
    );
    const data = await response.json().then((data) => data);
    setLatLon({ lat: await data[0].lat, lon: await data[0].lon });
  };

  const getToken = async () => {
    const token = await fetch('https://get-token.onrender.com')
      .then((res) => res.json())
      .then((data) => data?.access_token);
    return token;
  };

  const getData = async () => {
    setLoading(true);
    await getLatLong();
    const token = await getToken();
    await fetch(
      URL +
        `/journeys?originLongitude=11.9852005&originLatitude=57.6964202&destinationLongitude=${
          latLon()?.lon
        }&destinationLatitude=${latLon()?.lat}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((d) => d.json())
      .then((d) => setData(d?.results))
      .catch((err) => {
        console.error(err);
      });
    setLoading(false);
  };

  return (
    <div class={styles.App}>
      <img class={styles.Logo} src={Logo} alt="squeed_logo" />
      <header class={styles.header}>
        <h2>Nedräkning till julbord</h2>
        <Countdown />
        <div class={styles.flex}>
          <div class={styles.widget}>
            <h3>Lisebergs Hamnkrog</h3>
            <h3>20:30</h3>
            <img class={styles.QR} src={QR} alt="link" />
          </div>
          <div class={styles.widget}>
            {!data() ? (
              <div>
                <h3>Jag vill hem</h3>
              </div>
            ) : (
              <div class={styles.List}>
                <For each={data()}>
                  {(item) => {
                    const name =
                      item?.tripLegs &&
                      item?.tripLegs[0]?.serviceJourney?.line?.name;
                    const depDate =
                      item?.departureAccessLink?.destination
                        ?.estimatedTime;
                    const arrDate =
                      item?.arrivalAccessLink?.destination
                        ?.estimatedTime;
                    const dep =
                      depDate &&
                      `${
                        new Date(depDate).getHours() +
                        ':' +
                        new Date(depDate).getMinutes()
                      }`;
                    const arr =
                      arrDate &&
                      `${
                        new Date(arrDate).getHours() +
                        ':' +
                        new Date(arrDate).getMinutes()
                      }`;
                    if (!dep) {
                      return null;
                    }
                    return (
                      <div class={styles.Item}>
                        <p>
                          {
                            item?.departureAccessLink?.destination
                              ?.stopPoint?.name
                          }{' '}
                          -{' '}
                          {
                            item?.arrivalAccessLink?.origin?.stopPoint
                              ?.name
                          }
                        </p>
                        <p>{name}</p>
                        <p>Avgång: {dep}</p>
                        <p>Ankomst: {arr}</p>
                      </div>
                    );
                  }}
                </For>
              </div>
            )}
            <input
              class={styles.Input}
              type="text"
              placeholder="Hemadress"
              onChange={(e) => setInputData(e.target.value)}
            />
            <button class={styles.SubmitButton} onClick={getData}>
              {loading() ? (
                <span>Loading...</span>
              ) : (
                <span>Submit</span>
              )}
            </button>
          </div>
        </div>
      </header>
      <canvas
        style={{ 'pointer-events': 'none' }}
        id="canvas"
      ></canvas>
    </div>
  );
};

export default App;
