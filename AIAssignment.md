# Homework 5 AI Synthesis Activity

## Activity: You used AI

### Part 1

My complete conversation with Claude about this project:
[https://claude.ai/share/98fbe515-545a-439e-8af3-22dbe41b12e9](https://claude.ai/share/98fbe515-545a-439e-8af3-22dbe41b12e9)

### Part 2

I used AI especially at the beginning because I felt like it was the fastest way for me to get started on understanding the problem specs. Regardless, I spent a great deal of time just reading through the spec, but the AI allowed me to ask questions, whether smart or dumb, that helped me comprehend the problem approach a bit easier.

I think it was also helpful to ask it when I was stuck on certain code implementations. There are some standardized formatting for authentication, services, and other parts of the code that would look extremely janky if I wrote it unguided, or it would've taken a lot of time to check the obscure reference of an older or less maintained API doc. In this sense, I'm essentially using the AI as a better form of StackOverflow, allowing me to get the best tailored responses for my situation.

I also used AI to help me debug, as there were some error cases that made me want to pull my hair out. Asking AI to generate some possible issues was a fast and easy way to avoid debugging a lot of time-consuming errors.

### Part 3

In one part of the chat, I asked AI to help me debug a section of code that I used in the redisClient.ts. I got a TypeScript error that essentially said that our string for the port (parsed into an integer) could potentially be 'undefined', which is an issue since this would cause the redis client creation to error as well. I was a bit lost, as I'm not the best at TS, but after feeding it in, I decided to use the '!' operator to assert that the input would not be null. This worked fine and allowed me to compile the code and test the client creation easily.

### Part 4

I was a bit confused about the AI's choice to format a route as:

`app.use('/api/box', authenticate, boxRoutes);`

However, after doing some research, I realized that this is a method of authenticating an endpoint within the route itself. After doing more research, I settled with adding the authentication middleware within the route file instead of the actual route, as it would prevent overlap much easier, especially since my organization split our authentication between box, pokemon, and token, where box is the only one that needed authentication. Overall, it was simple research that I would have come to much slower had Claude not been able to generate code in the first place for me to view.
