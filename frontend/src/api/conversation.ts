const API_URL = "http://localhost:5000/api";

export const getMessages = async (conversationId) => {
  try {
    const response = await fetch(
      `${API_URL}/conversations/messages/${localStorage.getItem(
        "user"
      )}/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json(); // Convert response to JSON
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null; // Handle errors gracefully
  }
};

export const fetchConversations = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/conversations/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations", error);
    throw error;
  }
};
