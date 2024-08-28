# Components

### FixedPage

Used for pages you don't want to scroll. For example a chat where you only want to scroll the chat window.

#### Example

```
<FixedPage>
    <p>Some content</p>
</FixedPage>
```

### Chat

Chat component which uses the Azure model. You can show or hide the chat history with showHistory. The onMessage callback lets you use the chat response in page/component. 

#### Example

```
    let [isLoading, setIsLoading]: any = useState(false);
    const initialMessages: Message[] = [
        {
            id: '0',
            role: 'assistant',
            content: 'Hello! How can I help you?',
        },
    ];

    const body = {
        modelName: 'gpt-3.5-turbo',
    };

    const handleMessage = (message: string) => {
        // do something with the message
    }

    <Chat 
        showHistory={true}
        onMessage={handleMessage}
        initialMessages={initialMessages}
        body={body}
        placeholder={"What would you like to know?"}
        rows={2}
        messageLoading={(loading) => setIsLoading(loading)}/>
```

- ```showHistory``` set to true or false whether you want to show the chat history
- ```onMessage``` callback to receive the response from the chat
- ```onUndo``` callback to recieve the previous message after an undo request
- ```undoMessageRequested``` set to true when you want the previous AI message from the chat history and set back to false after this is recieved
- ```initialMessages``` array of messages
- ```body``` useChat body
- ```placeholder``` placeholder text set in textarea or as label if there is no history
- ```rows``` number of rows in the textarea
- ```messageLoading``` callback to set loading state
- ```editedLatestMessage``` updates the most recent message response to this string
