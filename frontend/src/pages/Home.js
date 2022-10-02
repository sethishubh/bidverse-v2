import React from "react";
import { useEffect, useContext } from "react";
import { CategoryContext } from "../store/categoryContext";
import HeroCarousel from "../components/UI/HeroCarousel";
import Featuredbids from "../components/General/Featuredbids";

const Home = () => {
  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <HeroCarousel />
      <main>
        {/* <PopularBids />
        <UpcomingBids />
        <RecentBids />
        <Topbidders /> */}
        <Featuredbids />
      </main>
    </>
  );
};

export default Home;
