import axios from "axios";
import { PromotionInterface } from "../../interfaces/IPromotion"; // Import Interface
import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/Signln";


const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

// Promotion Service Functions

async function GetPromotions() {
  return await axios
    .get(`${apiUrl}/promotions`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPromotionById(id: string) {
  return await axios
    .get(`${apiUrl}/promotion/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreatePromotion(data: PromotionInterface) {
  return await axios
    .post(`${apiUrl}/promotion`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdatePromotionById(id: string, data: PromotionInterface) {
  return await axios
    .put(`${apiUrl}/promotion/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeletePromotionById(id: string) {
  return await axios
    .delete(`${apiUrl}/promotion/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetDiscountType() {
  return await axios
    .get(`${apiUrl}/DiscountType`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetStatus() {
  return await axios
    .get(`${apiUrl}/status`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// แก้ไขฟังก์ชัน UsePromotion ให้รองรับ promotionId
async function UsePromotion(promotionId: number) {
  return await axios
    .post(`${apiUrl}/zzz`, { promotion_id: promotionId }, requestOptions) // Send promotion_id in the body of the POST request
    .then((res) => res)
    .catch((e) => e.response);
}



// Existing Functions (Users, Gender, etc.)
async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetGender() {
  return await axios
    .get(`${apiUrl}/genders`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsers() {
  return await axios
    .get(`${apiUrl}/users`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsersById(id: string) {
  return await axios
    .get(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateUsersById(id: string, data: UsersInterface) {
  return await axios
    .put(`${apiUrl}/user/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteUsersById(id: string) {
  return await axios
    .delete(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateUser(data: UsersInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  SignIn,
  GetGender,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
  // Promotion Exports
  GetPromotions,
  GetPromotionById,
  CreatePromotion,
  UpdatePromotionById,
  DeletePromotionById,
  GetDiscountType,
  GetStatus,
  UsePromotion,
};
