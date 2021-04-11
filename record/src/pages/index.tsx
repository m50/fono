import React, { useEffect } from 'react';
import Head from 'next/head';
import useSocket from 'hooks/useSocket';
import styles from '../styles/Home.module.css';

export default function Home() {
  const ws = useSocket();
  useEffect(() => {
    ws?.on('welcome', (data) => console.log(data));
    ws?.send('test', { value: 'hi!' });
  }, [ws]);
  return (
    <div className={styles.container}>
      <Head>
        <title>NextJS TS Starter</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>src/pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a href="https://netlify.com" className={styles.card}>
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Netlify.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer} />
    </div>
  );
}
