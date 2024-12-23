import axios from "axios";
import { PromotionInterface } from "../../interfaces/IPromotion"; 
import { WithdrawalInterface } from "../../interfaces/IWithdrawal";
import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/Signln";

const apiUrl = "http://localhost:8000";

// จัดการ Authorization Header
const token = localStorage.getItem("token");
const tokenType = localStorage.getItem("token_type");
const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: token && tokenType ? `${tokenType} ${token}` : "",
  },
};

// ฟังก์ชันจัดการ Error
function handleApiError(error: any) {
  if (error.response) {
    console.error(`API Error: ${error.response.data.error}`);
    return error.response.data.error;
  }
  console.error("Network Error");
  return "Network Error";
}

// Promotion Service Functions
async function GetPromotions() {
  try {
    return await axios.get(`${apiUrl}/promotions`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetPromotionById(id: string) {
  try {
    return await axios.get(`${apiUrl}/promotion/${id}`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function CreatePromotion(data: PromotionInterface) {
  try {
    return await axios.post(`${apiUrl}/promotion`, data, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function UpdatePromotionById(id: string, data: PromotionInterface) {
  try {
    return await axios.put(`${apiUrl}/promotion/${id}`, data, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function DeletePromotionById(id: string) {
  try {
    return await axios.delete(`${apiUrl}/promotion/${id}`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetDiscountType() {
  try {
    return await axios.get(`${apiUrl}/DiscountType`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetStatusPromotion() {
  try {
    return await axios.get(`${apiUrl}/StatusPromotion`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function UsePromotion(data: { promotion_code: string }) {
  try {
    return await axios.post(`${apiUrl}/test`, data, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

// Withdrawal Service Functions
async function GetCommission() {
  try {
    return await axios.get(`${apiUrl}/zzz`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetWithdrawal() {
  try {
    return await axios.get(`${apiUrl}/withdrawal/statement`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetWithdrawalById(id: string) {
  try {
    return await axios.get(`${apiUrl}/withdrawal/statement/${id}`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function CreateWithdrawal(data: WithdrawalInterface) {
  try {
    return await axios.post(`${apiUrl}/withdrawal/money`, data, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetBankName() {
  try {
    return await axios.get(`${apiUrl}/bankname`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

// User Service Functions
async function SignIn(data: SignInInterface) {
  try {
    return await axios.post(`${apiUrl}/signin`, data, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetGender() {
  try {
    return await axios.get(`${apiUrl}/genders`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetUsers() {
  try {
    return await axios.get(`${apiUrl}/users`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetUsersById(id: string) {
  try {
    return await axios.get(`${apiUrl}/user/${id}`, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function UpdateUsersById(id: string, data: UsersInterface) {
  try {
    return await axios.put(`${apiUrl}/user/${id}`, data, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

async function DeleteUsersById(id: string) {
  try {
    return await axios.delete(`${apiUrl}/user/${id}`, requestOptions);
  } catch (error)    {
    return handleApiError(error);
  }
}

async function CreateUser(data: UsersInterface) {
  try {
    return await axios.post(`${apiUrl}/signup`, data, requestOptions);
  } catch (error) {
    return handleApiError(error);
  }
}

// Export all functions
export {
  SignIn,
  GetGender,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
  //promotion
  GetPromotions,
  GetPromotionById,
  CreatePromotion,
  UpdatePromotionById,
  DeletePromotionById,
  GetDiscountType,
  GetStatusPromotion,
  UsePromotion,
  //withdrawal
  GetCommission,
  GetWithdrawal,
  GetWithdrawalById,
  CreateWithdrawal,
  GetBankName,
};
