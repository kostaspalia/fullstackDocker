import Todo from './Todo'
import '@testing-library/jest-dom';
import { render } from '@testing-library/react'

test('todo component contains correct text', () => {
    const todo = {
        text: "Test",
        done: false
    };

    const thetodo = render(<Todo todo={todo} onClickComplete={() => {}} onClickDelete={() => {}} />)
    expect(thetodo.container).toHaveTextContent(todo.text)
})