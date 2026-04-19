document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("searchBtn");

  // যদি element না থাকে → stop
  if (!searchInput || !searchBtn) return;

  function goSearch() {
    const value = searchInput.value.trim();

    if (value === "") return;

    console.log("Searching:", value);

    window.location.href = `search-result.html?q=${encodeURIComponent(value)}`;
  }

  searchBtn.addEventListener("click", goSearch);

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      goSearch();
    }
  });

});