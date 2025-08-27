import {
  postCall,
  getCall,
  authorizedPostCall,
  authorizedPutCall,
  authorizedDeleteCall,
} from "./APIsService";

export const fetchAll = async (body) => {
  return new Promise((resolve, reject) => {
    postCall("/video", body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const fetchAllNonPaged = async () => {
  return new Promise((resolve, reject) => {
    getCall("/video")
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const fetchOne = async (id) => {
  return new Promise((resolve, reject) => {
    getCall(`/video/${id}`)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const update = async (id, body) => {
  return new Promise((resolve, reject) => {
    authorizedPutCall(`/video/${id}`, body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const add = async (body) => {
  return new Promise((resolve, reject) => {
    authorizedPostCall(`/video/add`, body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const remove = async (id) => {
  return new Promise((resolve, reject) => {
    authorizedDeleteCall(`/video/${id}`)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const updateCompulsoryVideo = async (body) => {
  return new Promise((resolve, reject) => {
    authorizedPutCall(`/compulsory-video`, body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const fetchCompulsoryVideo = async () => {
  return new Promise((resolve, reject) => {
    getCall(`/compulsory-video`)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};
