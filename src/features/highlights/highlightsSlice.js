import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    user: '0',
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    user: '2',
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  },
]

const highlightsSlice = createSlice({
  name: 'highlights',
  initialState,
  reducers: {
    highlightAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0,
            },
          },
        }
      },
    },
    reactionAdded(state, action) {
      const { highlightId, reaction } = action.payload
      const existingHighlight = state.find((highlight) => highlight.id === highlightId)
      if (existingHighlight) {
        existingHighlight.reactions[reaction]++
      }
    },
    highlightUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingHighlight = state.find((highlight) => highlight.id === id)
      if (existingHighlight) {
        existingHighlight.title = title
        existingHighlight.content = content
      }
    },
  },
})

export const { highlightAdded, highlightUpdated, reactionAdded } = highlightsSlice.actions

export default highlightsSlice.reducer
