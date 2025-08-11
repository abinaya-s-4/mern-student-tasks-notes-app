// Mock API — replace with real endpoints later
export function mockFetchNotes() {
  return Promise.resolve([
    { id: "1", title: "Calculus Homework", content: "Finish exercises 5 to 10 from chapter 3." },
    { id: "2", title: "Science Project", content: "Prepare slides about photosynthesis for next week's presentation." }
  ]);
}

export function mockDeleteNote(id) {
  return Promise.resolve();
}

export function mockFetchNote(id) {
  const notes = [
    { id: "1", title: "Calculus Homework", content: "Finish exercises 5 to 10 from chapter 3." },
    { id: "2", title: "Science Project", content: "Prepare slides about photosynthesis for next week's presentation." }
  ];
  return Promise.resolve(notes.find(n => n.id === id));
}

export function mockSummarizeNote(note) {
  return Promise.resolve("Summary: " + note.content.slice(0, 70) + "... (AI placeholder)");
}

