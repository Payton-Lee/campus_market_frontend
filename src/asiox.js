import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:9999/shop/api/v1",
  timeout: 10000
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});

instance.interceptors.response.use((config) => {
  return config;
})

export const login = async (user) => {
  try {
    const res = await instance.post("/admin/login", user);
    return res.data;
  } catch (e) {
    return e
  }
}

export const register = async (user) => {
  try {
    const res = await instance.post("/admin/register", user);
    return res.data
  } catch (e) {
    return e
  }
}

export const permissionList = async (params) => {
  try {
    const res = await instance.get("/permission/permissionList", {
      params,
    });
    return res.data;
  } catch (e) {
    return e
  }
}

export const roleList = async (params) => {
  try {
    const res = await instance.get("/permission/roleList", {
      params,
    });
    return res.data;
  } catch (e) {
    return e
  }
}

export const deleteRole = async (roleId) => {
  try {
    const res = await instance.delete(`/permission/deleteRole/${roleId}`);
    return res.data;
  } catch (e) {
    return e
  }
}

export const editRole = async (role) => {
  try {
    const res = await instance.put("/permission/editRole", role);
    return res.data;
  } catch (e) {
    return e
  }
}

export const addRole = async (role) => {
  try {
    const res = await instance.post("/permission/newRole", role);
    return res.data;
  } catch (e) {
    return e
  }
}

export const getRolePermissionList = async () => {
  try {
    const res = await instance.get("/permission/rolePermissionList");
    return res.data;
  } catch (e) {
    return e
  }
}

export const getCurrentRolePermission = async (roleId) => {
  try {
    const res = await instance.get(`/permission/singleRolePermission/${roleId}`);
    return res.data;
  } catch (e) {
    return e
  }
}

export const setCurrentRolePermission = async (roleId, params) => {
  try {
    const res = await instance.put(`/permission/${roleId}/rolePermission?permissionIds=${params}`);
    return res.data;
  } catch (e) {
    return e
  }
}

export const userList = async (params) => {
  try {
    const res = await instance.get("/user/userList", {
      params,
    });
    return res.data;
  } catch (e) {
    return e
  }
}

export const editUserState = async (userId, state) => {
  try {
    const res = await instance.put(`/user/${userId}/editUser/${state}`);
    return res.data;
  } catch (e) {
    return e
  }
}

export const userRole = async (userId) => {
  try {
    const res = await instance.get(`/user/userRole/${userId}`);
    return res.data;
  } catch (e) {
    return e
  }
}

export const roleName = async () => {
  try {
    const res = await instance.get(`/user/roleName`);
    return res.data;
  } catch (e) {
    return e
  }
}

export const editUserRole = async (userId, roleIds) => {
  try {
    const res = await instance.put(`/user/${userId}/editUserRole/${roleIds}`);
    return res.data;
  } catch (e) {
    return e
  }
}

export const goodsList = async (params) => {
  try {
    const res = await instance.get("/goods/goodsList", { params });
    return res.data;
  } catch (e) {
    return e
  }
}

export const editGoodsState = async (goodsId, goodsState) => {
  try {
    const res = await instance.put(`/goods/${goodsId}/onShelves/${goodsState}`);
    return res.data;
  } catch (e) {
    return e
  }
}

export const editGoods = async (goods) => {
  try {
    const res = await instance.put("/goods/editGoods", goods);
    return res.data;
  } catch (e) {
    return e
  }
}

export const newGoods = async (goods) => {
  try {
    const res = await instance.post("/goods/newGoods", goods);
    return res.data;
  } catch (e) {
    return e
  }
}

export const addNewImage = async (image) => {
  try {
    const res = await instance.post("/goods/newImage", image);
    return res.data;
  } catch (e) {
    return e
  }
}