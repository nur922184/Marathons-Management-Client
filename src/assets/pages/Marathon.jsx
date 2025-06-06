import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import './Marathon.css'
const Marathon = () => {
  const [marathons, setMarathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // প্রতি পেজে কত আইটেম দেখাবে
  const [currentPage, setCurrentPage] = useState(0); // বর্তমান পেজ নম্বর

  const numberOfPages = Math.ceil(count / itemsPerPage); // মোট পেজ সংখ্যা

  // Items Per Page পরিবর্তনের হ্যান্ডলার
  const handleItemsPerPage = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(0); // নতুন পেজ সাইজ সেট করার পর প্রথম পেজে ফিরে যাবে
  };

  // API থেকে মোট সংখ্যা ফেচ করা
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("https://asserment-eleven-server.vercel.app/productsCount");
        const data = await response.json();
        setCount(data.count);
        setLoading(false) // মোট প্রোডাক্ট সংখ্যা
      } catch (error) {
        console.error("Error fetching total count:", error);
      }
    };

    fetchCount();
  }, []);

  // API থেকে পেজ ভিত্তিক ডেটা ফেচ করা
  useEffect(() => {
    const fetchMarathons = async () => {
      try {
        const response = await fetch(
          `https://asserment-eleven-server.vercel.app/marathons?page=${currentPage}&size=${itemsPerPage}`
        );
        const data = await response.json();
        setMarathons(data); // বর্তমান পেজের ডেটা সেট করা
      } catch (error) {
        console.error("Error fetching marathons:", error);
      }
    };

    fetchMarathons();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Marathons</h2>

      {loading ? (
        <Loading></Loading>
      ) : marathons.length === 0 ? (
        <p className="text-center text-xl text-gray-500">No marathons available.</p>
      ) : (
        <div className="grid grid-cols-1 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {marathons.map((marathon) => (

            <div key={marathon._id} className="card mx-auto dark:border-gray-600">
                <img
                  src={marathon.image || "https://via.placeholder.com/300x200"}
                  alt={marathon.title}
                  className="cards w-100% h-64 rounded-lg"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold">{marathon.title}</h3>
                  <p className="text-gray-600">Location: {marathon.location}</p>
                  <p className="text-gray-600 mb-5">
                    Registration:{" "}
                    {new Date(marathon.startRegistrationDate).toLocaleDateString()} -{" "}
                    {new Date(marathon.endRegistrationDate).toLocaleDateString()}
                  </p>
                  <div className="mt-auto">
                    <Link to={`/marathons/${marathon._id}`}>
                      <button
                        class=" card-button font-sans flex justify-center gap-2 items-center mx-auto shadow-xl text-gray-50 bg-[#0A0D2D] backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-1 overflow-hidden border-2 rounded-2xl group mt-7"
                        type="submit"
                      >
                        See Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 19"
                          class="w-8 h-8 justify-end bg-gray-50 group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                        >
                          <path
                            class="fill-gray-800 group-hover:fill-gray-800"
                            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                          ></path>
                        </svg>
                      </button>

                    </Link>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination mt-14 flex items-center justify-center gap-2">
        <button
          className="bg-gray-300 p-2 dark:bg-gray-700 text-white rounded-md hover:bg-gray-400"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Prev
        </button>

        {[...Array(numberOfPages).keys()].map((num) => (
          <button
            key={num}
            className={`p-2 rounded-md ${currentPage === num ? "bg-blue-500  dark:bg-zinc-800 text-white" : "bg-gray-200 dark:bg-gray-700 text-white"
              }`}
            onClick={() => setCurrentPage(num)}
          >
            {num + 1}
          </button>
        ))}

        <button
          className="bg-gray-300 dark:bg-gray-700 text-white p-2 rounded-md hover:bg-gray-400"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, numberOfPages - 1))
          }
          disabled={currentPage === numberOfPages - 1}
        >
          Next
        </button>

        {/* Items per page */}
        <select
          className="ml-4 p-2 bg-gray-200 rounded-md dark:bg-gray-700 text-white"
          value={itemsPerPage}
          onChange={handleItemsPerPage}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Marathon;
