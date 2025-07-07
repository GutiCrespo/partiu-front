type SetCookieTypes = {
  name: string;
  value: string;
  daysToExpire: number;
};

export const setCookie = ({ name, value, daysToExpire }: SetCookieTypes) => {
  const date = new Date();

  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);

  const expires = "expires=" + date.toUTCString();

  document.cookie = name + "=" + value + "; " + expires + "; path=/";
};

export const getCookie = (name: string) => {
  const nameWithEqualSign = name + "=";

  const obtainedCookie = decodeURIComponent(document.cookie);

  const cookiesList = obtainedCookie.split("; ");

  let res = "";

  cookiesList.forEach((currentCookie) => {
    if (currentCookie.indexOf(nameWithEqualSign) === 0)
      res = currentCookie.substring(nameWithEqualSign.length);
  });

  if (res) {
    return res;
  }

  return false;
};

export const removeCookie = (name: string) => {
  document.cookie =
    name + "=" + `; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
