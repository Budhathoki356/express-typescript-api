import $db from '../src/utils/db.server';

type Author = {
  firstName: string;
  lastName: string;
};

type Book = {
  title: string;
  isFiction: boolean;
  datePublished: Date;
};

async function seed() {
  await Promise.allSettled(
    getAuthors().map((author) => {
      return $db.author.create({
        data: { firstName: author.firstName, lastName: author.lastName },
      });
    })
  );

  const author = await $db.author.findFirst({
    where: {
      firstName: 'William',
    },
  });

  await Promise.allSettled(
    getBooks().map((book) => {
      const { datePublished, isFiction, title } = book;
      return $db.book.create({
        data: {
          title,
          isFiction,
          datePublished,
          authorId: author!.id, // used not null assertion operator (!)
        },
      });
    })
  );
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await $db.$disconnect();
    console.log('Default Authors and Books are assigned.');
  });

function getAuthors(): Array<Author> {
  return [
    {
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      firstName: 'William',
      lastName: 'Shakespeare',
    },
  ];
}

function getBooks(): Array<Book> {
  return [
    {
      title: 'Sapiens',
      isFiction: true,
      datePublished: new Date(),
    },
    {
      title: 'Home Deus',
      isFiction: false,
      datePublished: new Date(),
    },
  ];
}
