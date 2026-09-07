async function post(path, body) {
  const response = await fetch("/api/auth" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = { message: "The server sent something unreadable." };
  }

  if (!response.ok) {
    const failure = new Error(data.message || "Request failed.");
    failure.data = data;
    failure.status = response.status;
    throw failure;
  }

  return data;
}

export function registerUser(details) {
  return post("/register", details);
}

export function verifyOtp(email, otp) {
  return post("/verify-otp", { email, otp });
}

export function resendOtp(email) {
  return post("/resend-otp", { email });
}

export function loginUser(email, password) {
  return post("/login", { email, password });
}
