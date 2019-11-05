const parseFlashCommand = require('./parseFlashCommand')

it('returns just the message', () => {
    const command = 'info 5 "Hello World"'
    const res = parseFlashCommand(command)
    expect(res).toEqual({ message: "Hello World",
                          duration: 300,
                          level: 'info'})
})
