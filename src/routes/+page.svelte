<script lang="ts">
	/**
	 * Dependence
	 */
	import { fade } from 'svelte/transition';
	import { getPosts } from '$lib/api/methods/posts';
	import { getReasonPhrase } from 'http-status-codes';
	import { CACHE_KEYS } from '$lib/constants/cache';

	/**
	 * Components
	 */
	import Loader from '$lib/components/Loader.svelte';
	import { readFromCache, saveToCache } from '$lib/utils/cache';

	/**
	 * Types
	 */
	import type { IPostsResponse } from '$lib/api/types/response/weather';
	import { MESSAGES } from '$lib/constants/messages';

	// It must be store or some toast api
	let infoData = $state({
		data: ''
	});

	const loadData = async () => {
		const response = await getPosts();
		console.log(response);

		if (response.success) {
			// Validation data with valibot/zod/etc...

			// If Data is valid
			saveToCache(CACHE_KEYS.POSTS, response.data);
			return response.data;
		}

		const cachedData = await readFromCache<IPostsResponse>(CACHE_KEYS.POSTS);

		if (cachedData !== null) {
			infoData.data = MESSAGES.DATA_LOADED_FROM_CACHE;
			return cachedData;
		}

		infoData.data = MESSAGES.NO_DATA_TO_DISPLAY;
		throw new Error(getReasonPhrase(response.data.code));
	};
</script>

<div class="layout">
	<h1>Latest posts</h1>

	<div class="info_row">{infoData.data}</div>

	{#await loadData()}
		<Loader />
	{:then posts}
		<div class="posts">
			{#each posts as post (post.id)}
				<div class="posts__item" in:fade>
					<h4>{post.title}</h4>
					<p>{post.body}</p>
				</div>
			{/each}
		</div>
	{:catch e}
		<h1>Errored: {e}</h1>
	{/await}
</div>

<style lang="scss">
	.layout {
		padding: 25px 50px;

		display: flex;
		flex-direction: column;

		justify-content: center;
		align-items: center;

		gap: 50px;

		width: 100%;
		height: max-content;

		h1 {
			text-align: center;
		}
	}

	.posts {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 500px;

		&__item {
			padding: 10px 15px;
			display: flex;
			flex-direction: column;
			gap: 15px;

			height: 150px;
			width: 100%;

			border-radius: 8px;

			background: rgba(0, 0, 0, 0.08);

			h4 {
				color: #2b302c;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			p {
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2; /* number of lines to show */
				line-clamp: 2;
				-webkit-box-orient: vertical;

				color: rgba(43, 48, 44, 0.7);
			}
		}
	}

	.info_row {
		text-align: center;
		font-size: small;
		background-color: cadetblue;
		color: white;
		border-radius: 3px;
	}
</style>
