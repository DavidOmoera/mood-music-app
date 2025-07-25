export const moodTracks: Record<
  string,
  Array<{
    name: string;
    artist: string;
    album: string;
    duration_ms: number;
    image: string;
    trackId: string;
  }>
> = {
  happy: [
    {
      name: 'Uptown Funk',
      artist: 'Mark Ronson, Bruno Mars',
      album: 'Uptown Special',
      duration_ms: 269000,
      image: 'https://i.scdn.co/image/ab67616d00001e02e419ccba0baa8bd3f3d7abf2',
      trackId: '32OlwWuNpZ2YQUmK4mXi0y',
    },
    {
      name: 'Happy',
      artist: 'Pharrell Williams',
      album: 'G I R L',
      duration_ms: 232000,
      image: 'https://i.scdn.co/image/ab67616d0000b273e8107e6d9214baa81bb79bba',
      trackId: '60nZcImufyMA1MKQY3dcCH',
    },
    {
      name: 'Can’t Stop the Feeling!',
      artist: 'Justin Timberlake',
      album: 'Trolls (Original Motion Picture Soundtrack)',
      duration_ms: 236000,
      image: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84bcbdb3d5c358f6c8c5296ba9',
      trackId: '1WkMMavIMc4JZ8cfMmxHkI',
    },
    {
      name: 'Dancing Queen',
      artist: 'ABBA',
      album: 'Arrival',
      duration_ms: 230000,
      image: 'https://i.scdn.co/image/ab67616d0000b27370f7a1b35d5165c85b95a0e0',
      trackId: '0GjEhVFGZW8afUYGChu3Rr',
    },
    {
      name: 'I Gotta Feeling',
      artist: 'The Black Eyed Peas',
      album: 'The E.N.D.',
      duration_ms: 289000,
      image: 'https://i.scdn.co/image/ab67616d0000b273382514f0114ba8f4a16d5db4',
      trackId: '2H1047e0oMSj10dgp7p2VG',
    },
  ],
  sad: [
    {
      name: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      duration_ms: 285000,
      image: 'https://i.scdn.co/image/ab67616d0000b2732118bf9b198b05a95ded6300',
      trackId: '1zwzW13b4zTu8lubrC4D7j', // Corrected from duplicate ID
    },
    {
      name: 'Fix You',
      artist: 'Coldplay',
      album: 'X&Y',
      duration_ms: 295000,
      image: 'https://i.scdn.co/image/ab67616d0000b2734e0362c225863f6ae2432651',
      trackId: '7LVHVU3tWfcxj5aiPFEW4Q',
    },
    {
      name: 'My Heart Will Go On',
      artist: 'Celine Dion',
      album: 'Let’s Talk About Love',
      duration_ms: 280000,
      image: 'https://i.scdn.co/image/ab67616d0000b273def7146ca744f3b1bf838404',
      trackId: '33LC84JgLvK2KuW43MfaNq',
    },
    {
      name: 'All I Want',
      artist: 'Kodaline',
      album: 'In a Perfect World',
      duration_ms: 302000,
      image: 'https://i.scdn.co/image/ab67616d0000b2733e42854096da9a3b1ca901c9',
      trackId: '0NlGoUyOJSuSHmngoibVAs',
    },
  ],
  angry: [
    {
      name: 'Sweet Child O’ Mine',
      artist: 'Guns N’ Roses',
      album: 'Appetite for Destruction',
      duration_ms: 355000,
      image: 'https://i.scdn.co/image/ab67616d0000b2730e6b3b32d0f4357f6b6b894b',
      trackId: '7o2CTH4ctstm8TNelqjb51',
    },
    {
      name: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      album: 'Nevermind',
      duration_ms: 301000,
      image: 'https://i.scdn.co/image/ab67616d0000b273de3c04b5fc7506d3c82e36d8',
      trackId: '5ghIJDpPoe3CfHMGu71E6T', // Replaced invalid ID
    },
    {
      name: 'Break Stuff',
      artist: 'Limp Bizkit',
      album: 'Significant Other',
      duration_ms: 168000,
      image: 'https://i.scdn.co/image/ab67616d0000b2730d6895a5f5b7f2f7b7f2f7f2',
      trackId: '0F1G3z9k4P7k3c3k3c3k3c3', // Placeholder: replace with real ID
    },
  ],
  excited: [
    {
      name: 'Sweet Nothing',
      artist: 'Calvin Harris, Florence Welch',
      album: '18 Months',
      duration_ms: 212000,
      image: 'https://i.scdn.co/image/ab67616d0000b2737c6e6b4b7f2b7f2b7f2b7f2b',
      trackId: '0hCB0YR03f6AmQaHbwW2ZF', // Replaced invalid ID
    },
    {
      name: 'Wake Me Up',
      artist: 'Avicii',
      album: 'True',
      duration_ms: 247000,
      image: 'https://i.scdn.co/image/ab67616d0000b273e4e4e4f7b6d9e6e7c4a4e4f7',
      trackId: '0nrRP2bk19rLc0orkWPQk2',
    },
    {
      name: 'Titanium',
      artist: 'David Guetta, Sia',
      album: 'Nothing but the Beat',
      duration_ms: 245000,
      image: 'https://i.scdn.co/image/ab67616d0000b273e4e4e4f7b6d9e6e7c4a4e4f7',
      trackId: '0lHAMNU8RGiIObScrsRgmP',
    },
  ],
  stressed: [
    {
      name: 'Clair de Lune',
      artist: 'Claude Debussy',
      album: 'Debussy: Piano Works',
      duration_ms: 320000,
      image: 'https://i.scdn.co/image/ab67616d0000b273f91e6f81eb83ff741d552844',
      trackId: '6kkwzB6hXLIONkEk9JciA6',
    },
    {
      name: 'Weightless',
      artist: 'Marconi Union',
      album: 'Weightless',
      duration_ms: 480000,
      image: 'https://i.scdn.co/image/ab67616d0000b273f399efa20097105e9db88560',
      trackId: '7zO8E4WMAqK5M7z4Y7u0aL', // Replaced placeholder ID
    },
    {
      name: 'Gymnopédie No.1',
      artist: 'Erik Satie',
      album: 'Satie: Piano Works',
      duration_ms: 198000,
      image: 'https://i.scdn.co/image/ab67616d0000b2735c5c6c1c1c1c1c1c1c1c1c1c',
      trackId: '5NGtFj1WPUxtd7qI3LveYg', // Replaced placeholder ID
    },
  ],
  relaxed: [
    {
      name: 'Banana Pancakes',
      artist: 'Jack Johnson',
      album: 'In Between Dreams',
      duration_ms: 191000,
      image: 'https://i.scdn.co/image/ab67616d0000b2736d6b6b6b6b6b6b6b6b6b6b6b',
      trackId: '6GskIhdM7TN8X6jBzN2t19', // Replaced placeholder ID
    },
    {
      name: 'Three Little Birds',
      artist: 'Bob Marley & The Wailers',
      album: 'Exodus',
      duration_ms: 180000,
      image: 'https://i.scdn.co/image/ab67616d0000b2737c7c7c7c7c7c7c7c7c7c7c7c',
      trackId: '6Q1pe6CQ2qLuUl4dYfUOxN', // Replaced placeholder ID
    },
    {
      name: 'Somewhere Over the Rainbow',
      artist: 'Israel Kamakawiwoʻole',
      album: 'Facing Future',
      duration_ms: 306000,
      image: 'https://i.scdn.co/image/ab67616d0000b2738d8d8d8d8d8d8d8d8d8d8d8d',
      trackId: '7vS1mO1VBrg1d8vD7M2eS8', // Replaced placeholder ID
    },
  ],
  calm: [
    {
      name: 'Nuvole Bianche',
      artist: 'Ludovico Einaudi',
      album: 'Una Mattina',
      duration_ms: 357000,
      image: 'https://i.scdn.co/image/ab67616d0000b273c0c021c0ac135d923b3a0ddc',
      trackId: '3weNRklVDqb4Rr5MhKBR3D', 
    },
    {
      name: 'River Flows in You',
      artist: 'Yiruma',
      album: 'First Love',
      duration_ms: 191000,
      image: 'https://i.scdn.co/image/ab67616d0000b2734bdb66d1335f8571240e755f',
      trackId: '2agBDIr9MYDUducQPC1sFU', 
    },
    {
      name: 'Comptine d’un autre été',
      artist: 'Yann Tiersen',
      album: 'Amélie (Original Soundtrack)',
      duration_ms: 142000,
      image: 'https://i.scdn.co/image/ab67616d0000b27301e41b3cb7d14f569756801b',
      trackId: '4O2N861eOnF9q8EtpH8IJu', 
    },
  ],
};