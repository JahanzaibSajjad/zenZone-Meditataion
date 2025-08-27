import {
  postCall,
  getCall,
  authorizedPostCall,
  authorizedPutCall,
  authorizedDeleteCall,
} from "./APIsService";

export const fetchAll = async (body) => {
  return new Promise((resolve, reject) => {
    postCall("/podcast", body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const fetchAllNonPaged = async () => {
  return new Promise((resolve, reject) => {
    getCall("/podcast")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const fetchOne = async (id) => {
  return new Promise((resolve, reject) => {
    getCall(`/podcast/${id}`)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const update = async (id, body) => {
  return new Promise((resolve, reject) => {
    authorizedPutCall(`/podcast/${id}`, body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const add = async (body) => {
  return new Promise((resolve, reject) => {
    authorizedPostCall(`/podcast/add`, body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const remove = async (id) => {
  return new Promise((resolve, reject) => {
    authorizedDeleteCall(`/podcast/${id}`)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};
