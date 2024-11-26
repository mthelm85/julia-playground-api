# Use the official Julia slim image as the base image
FROM julia:latest

# Install necessary system dependencies (including bash)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    bash \
    curl \
    build-essential && \
    rm -rf /var/lib/apt/lists/*

# Initialize Julia and make sure Pkg is available
RUN julia -e 'using Pkg'

# Install Julia packages (HTTP.jl for web server and others)
RUN julia -e 'using Pkg; Pkg.add(["DataFrames", "UnicodePlots"])'

# Set the working directory
WORKDIR /app

# Allow Julia code to be passed to the container and executed
CMD ["bash"]