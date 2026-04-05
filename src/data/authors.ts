export interface Author {
  name: string;
  image: string;
  bio?: string;
  booksCount?: number;
}

export const allAuthors: Author[] = [
  { 
    name: "Sudha Murty", 
    image: "/temp_assets/jk.png",
    bio: "Indian educator, author and philanthropist who is the chairperson of the Infosys Foundation.",
    booksCount: 12
  },
  { 
    name: "Chetan Bhagat", 
    image: "/temp_assets/jk.png",
    bio: "Indian author and columnist, known for his dramedy novels about young urban middle-class Indians.",
    booksCount: 8
  },
  { 
    name: "Ankur Warikoo", 
    image: "/temp_assets/jk.png",
    bio: "Indian entrepreneur, motivational speaker, and author of several self-help bestsellers.",
    booksCount: 3
  },
  { 
    name: "Amish Tripathi", 
    image: "/temp_assets/jk.png",
    bio: "Indian author known for his book series Shiva Trilogy and Ram Chandra Series.",
    booksCount: 7
  },
  { 
    name: "Ruskin Bond", 
    image: "/temp_assets/jk.png",
    bio: "Indian author of British descent, known for his contribution to Indian children's literature.",
    booksCount: 15
  },
  { 
    name: "J. K. Rowling", 
    image: "/temp_assets/jk.png",
    bio: "British author, best known for writing the Harry Potter fantasy series.",
    booksCount: 10
  }
];
