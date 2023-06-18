const apiKey = '9d086ab036170e8ab7e68ab954be6f58';

const videoColumns = document.querySelectorAll('.video_column');

const populateVideos = async () => {
  const movieIDs = [
    '123', // Replace with a valid movie ID
    '456', // Replace with a valid movie ID
    '789'  // Replace with a valid movie ID
    // Add more movie IDs as needed
  ];

  const fetchVideoInfo = async (movieID) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US&api_key=${apiKey}`
      );
      const data = await response.json();
      return data.results.length > 0 ? data.results[0].key : '';
    } catch (error) {
      console.error('Error:', error);
      return '';
    }
  };

  for (let i = 0; i < videoColumns.length; i++) {
    const videoColumn = videoColumns[i];
    const movieID = movieIDs[i];

    const videoPlayer = videoColumn.querySelector('.video_player');
    videoPlayer.src = `https://www.youtube.com/embed/${await fetchVideoInfo(movieID)}/?controls=1`;
    videoPlayer.setAttribute('allowfullscreen', '');

    const videoCaption = videoColumn.querySelector('.video_caption');
    videoCaption.textContent = movieID; // Set the caption to the movie ID for demonstration purposes
  }
};

populateVideos();
