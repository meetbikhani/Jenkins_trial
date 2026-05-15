import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Todo App", () => {
  test("renders heading", () => {
    render(<App />);
    expect(screen.getByText(/Todo List/i)).toBeInTheDocument();
  });

  test("adds a new task", () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Enter a task/i);
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, {
      target: { value: "Learn React Testing" },
    });

    fireEvent.click(addButton);

    expect(
      screen.getByText(/Learn React Testing/i)
    ).toBeInTheDocument();
  });

  test("marks task as completed", () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Enter a task/i);

    fireEvent.change(input, {
      target: { value: "Complete Task" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Add" })
    );

    const task = screen.getByText(/Complete Task/i);

    fireEvent.click(task);

    expect(task).toHaveStyle("text-decoration: line-through");
  });
});