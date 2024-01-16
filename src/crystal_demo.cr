require "kemal"

module CrystalDemo
  VERSION = "0.1.0"

  @@sockets = [] of HTTP::WebSocket

  # Creates a WebSocket handler.
  # Matches "ws://host:port/socket"
  ws "/chat" do |socket|
    @@sockets << socket

    # Handle incoming message and echo back to the client
    socket.on_message do |message|
      puts message
      @@sockets.each do |_socket|
        _socket.send "#{message}"
      end
    end

    # Executes when the client is disconnected. You can do the cleaning up here.
    socket.on_close do
      puts "Closing socket"
    end
  end

  static_headers do |response, filepath, filestat|
    if filepath =~ /\.html$/
      response.headers.add("Access-Control-Allow-Origin", "*")
    end
    response.headers.add("Content-Size", filestat.size.to_s)
  end

  serve_static({"gzip" => true, "dir_listing" => false})

  Kemal.run
end
