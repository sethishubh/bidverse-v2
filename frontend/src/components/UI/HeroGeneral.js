import classes from "./herogeneral.module.css";
import { useParams } from "react-router-dom";

const HeroGeneral = () => {
  // let { prId: categoryFromURL } = useParams();
  // categoryFromURL =
  //   categoryFromURL.charAt(0).toUpperCase() + categoryFromURL.slice(1);
  return (
    <>
      <div
        className={classes.heroimg}
        role="image"
        // style={{ height: "20rem", textAlign: "center" }}
        aria-label="Hero image"
      >
        <div className={classes.hero_text}>
          <h2 className={classes.hero_heading_main}>Products available to bid</h2>
        </div>
      </div>
    </>
  );
};

export default HeroGeneral;
