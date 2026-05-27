import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Users
export const getUsers = () => api.get('/users')
export const getUserById = (id) => api.get(`/users/${id}`)
export const createUser = (userData) => api.post('/users', userData)
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData)
export const deleteUser = (id) => api.delete(`/users/${id}`)
export const sendLoginOtp = (credentials) => api.post('/users/login/otp-send', credentials)
export const adminLogin = (credentials) => api.post('/users/login/admin', credentials)
export const verifyLoginOtp = (verification) => api.post('/users/login/otp-verify', verification)
export const requestPasswordReset = (emailData) => api.post('/users/forgot-password/request', emailData)
export const resetPassword = (resetData) => api.post('/users/forgot-password/reset', resetData)

// Workouts
export const getWorkouts = () => api.get('/workouts')
export const getWorkoutById = (id) => api.get(`/workouts/${id}`)
export const createWorkout = (workoutData) => api.post('/workouts', workoutData)
export const updateWorkout = (id, workoutData) => api.put(`/workouts/${id}`, workoutData)
export const deleteWorkout = (id) => api.delete(`/workouts/${id}`)

// Meals
export const getMeals = () => api.get('/meals')
export const getMealById = (id) => api.get(`/meals/${id}`)
export const createMeal = (mealData) => api.post('/meals', mealData)
export const updateMeal = (id, mealData) => api.put(`/meals/${id}`, mealData)
export const deleteMeal = (id) => api.delete(`/meals/${id}`)

// Goals
export const getGoals = () => api.get('/goals')
export const getGoalById = (id) => api.get(`/goals/${id}`)
export const createGoal = (goalData) => api.post('/goals', goalData)
export const updateGoal = (id, goalData) => api.put(`/goals/${id}`, goalData)
export const deleteGoal = (id) => api.delete(`/goals/${id}`)

// Roles
export const getRoles = () => api.get('/roles')
export const getRoleById = (id) => api.get(`/roles/${id}`)
export const createRole = (roleData) => api.post('/roles', roleData)
export const updateRole = (id, roleData) => api.put(`/roles/${id}`, roleData)
export const deleteRole = (id) => api.delete(`/roles/${id}`)

export default api
