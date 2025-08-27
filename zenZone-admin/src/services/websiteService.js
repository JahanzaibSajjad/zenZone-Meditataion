import {
  postCall,
  getCall,
  authorizedPostCall,
  authorizedPutCall,
  authorizedDeleteCall,
} from "./APIsService";

export const fetchAll = async (body) => {
  return new Promise((resolve, reject) => {
    postCall("/website", body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const fetchAllNonPaged = async () => {
  return new Promise((resolve, reject) => {
    getCall("/website")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const fetchOne = async (id) => {
  return new Promise((resolve, reject) => {
    getCall(`/website/${id}`)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const update = async (id, body) => {
  return new Promise((resolve, reject) => {
    authorizedPutCall(`/website/${id}`, body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const add = async (body) => {
  return new Promise((resolve, reject) => {
    authorizedPostCall(`/website/add`, body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const remove = async (id) => {
  return new Promise((resolve, reject) => {
    authorizedDeleteCall(`/website/${id}`)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};
