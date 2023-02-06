async function seedDbHandler(seedFiles: string[], command: 'seed' | 'clean') {
  console.time(`running ${command} on DB`);

  if (!seedFiles.length) {
    console.log('No seedfiles found');
  }

  await Promise.all(
    seedFiles.map(async (seedName) => {
      const seed = await import(`./${seedName}`);
      await seed[command]();
      return;
    }),
  );

  console.timeEnd(`running ${command} on DB`);
}
export { seedDbHandler };
export default { seedDbHandler };
