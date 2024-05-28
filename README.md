# Apollo LLM Analyser

## Motivation and Hypothesis

> I am exceedingly interested in mechanistic interpretability and deeply believe it is the path to both AI safety and increasing our intelligence.
>
> Solving mechanistic interpretability could allow us to increase human intelligence. A model that can solve a problem better than any human must contain algorithms that are better for solving the problem than those we have. With mechanistic interpretability, we could discover and adopt those algorithms by learning (updating our software) or modifying the brain to contain the algorithms (updating our hardware). Thus, interpretability can enable us to advance our own intelligence to keep up with the most intelligent models, not through reliance on them but through modifying ourselves or learning from them.
>
> This may be the best path to true ensured safety, not only through aligning models, but through coevolving together.
>
> \- Daniel Davies

## Current Features

-   **Chat**: Chat with a local LLM in a conversation interface.
-   **Data Collection**: Automate the collection of LLM activations on specified labels and prompt templates.
-   **View Activation Space**: View the collected activations in a 2D interactive scatterplot.

## Features in Development

-   **Build Analysis Models**: Train analysis models on collected activations to better understand the thoughts of LLMs.
    -   Progress: Trained a sparse classifier and achieved 100% accuracy on multiple labels
-   **Interpret Analysis Models**: View information on analysis models and train further analysis models using interpretable ML techniques to better understand them.
-   **Network Viewer**: View all the components of an LLM and the animated process of how an input is transformed into an output. Uses data from analysis models to provide insights and predictions on the interal mechanisms of an LLM.

## Key Technologies

-   **Front-End**: JavaScript, React, Chart.js
-   **Back-End**: Python, Flask, HuggingFace Transformers, NumPy, Pandas

## Demo

Click below to watch the first demo for Apollo:

[![Apollo Demo 1](https://img.youtube.com/vi/jNSura9WWoY/0.jpg)](https://www.youtube.com/watch?v=jNSura9WWoY)
