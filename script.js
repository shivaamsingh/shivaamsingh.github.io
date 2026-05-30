let skillsChart = null;

const chartThemes = {
	light: {
		accent: '#d97706',
		fill: 'rgba(217, 119, 6, 0.2)',
		grid: 'rgba(15, 23, 42, 0.12)',
		text: '#5f6b75'
	},
	dark: {
		accent: '#f59e0b',
		fill: 'rgba(245, 158, 11, 0.2)',
		grid: 'rgba(148, 163, 184, 0.25)',
		text: '#cbd5e1'
	}
};

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
	initTheme();
	initCharts();
	setupMobileMenu();
	setupProjectFiltering();
	setupScrollAnimations();
});

function initTheme() {
	const savedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);

	applyTheme(isDark);

	document.querySelectorAll('[data-theme-toggle]').forEach(toggle => {
		toggle.addEventListener('click', toggleTheme);
	});
}

function toggleTheme() {
	const isDark = !document.documentElement.classList.contains('dark');
	applyTheme(isDark);
}

function applyTheme(isDark) {
	document.documentElement.classList.toggle('dark', isDark);
	localStorage.setItem('theme', isDark ? 'dark' : 'light');
	updateThemeToggles(isDark);
	updateChartTheme();
}

function updateThemeToggles(isDark = document.documentElement.classList.contains('dark')) {
	document.querySelectorAll('[data-theme-toggle]').forEach(toggle => {
		toggle.textContent = isDark ? 'Light' : 'Dark';
		toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
		toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
	});
}

function initCharts() {
	const chartElement = document.getElementById('skillsChart');
	if (!chartElement) {
		return;
	}

	const ctx = chartElement.getContext('2d');
	const theme = getChartTheme();
	try {
		skillsChart = new Chart(ctx, {
			type: 'radar',
			data: {
				labels: ['Programming', 'AI/ML', 'Web Dev', 'CS Fundamentals', 'Tools', 'Soft Skills'],
				datasets: [{
					label: 'Proficiency Level',
					data: [75, 70, 65, 70, 75, 80],
					backgroundColor: theme.fill,
					borderColor: theme.accent,
					pointBackgroundColor: theme.accent,
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: theme.accent
				}]
			},
			options: {
				maintainAspectRatio: false,
				scales: {
					r: {
						angleLines: { display: true, color: theme.grid },
						grid: { color: theme.grid },
						pointLabels: { color: theme.text },
						suggestedMin: 0,
						suggestedMax: 100,
						ticks: { display: false }
					}
				},
				plugins: {
					legend: { display: false }
				}
			}
		});
		updateChartTheme();
	} catch (error) {
		console.error('Chart.js initialization failed:', error);
	}
}

function updateChartTheme() {
	if (!skillsChart) {
		return;
	}

	const theme = getChartTheme();
	const dataset = skillsChart.data.datasets[0];

	dataset.borderColor = theme.accent;
	dataset.pointBackgroundColor = theme.accent;
	dataset.pointHoverBorderColor = theme.accent;
	dataset.backgroundColor = theme.fill;

	skillsChart.options.scales.r.angleLines.color = theme.grid;
	skillsChart.options.scales.r.grid.color = theme.grid;
	skillsChart.options.scales.r.pointLabels.color = theme.text;

	skillsChart.update();
}

function getChartTheme() {
	return document.documentElement.classList.contains('dark') ? chartThemes.dark : chartThemes.light;
}

function setupMobileMenu() {
	const btn = document.getElementById('mobile-menu-btn');
	const menu = document.getElementById('mobile-menu');

	if (!btn || !menu) {
		return;
	}

	const closeMenu = () => {
		menu.classList.add('hidden');
		btn.setAttribute('aria-expanded', 'false');
		btn.textContent = '☰';
	};

	const openMenu = () => {
		menu.classList.remove('hidden');
		btn.setAttribute('aria-expanded', 'true');
		btn.textContent = 'X';
	};

	btn.addEventListener('click', () => {
		if (menu.classList.contains('hidden')) {
			openMenu();
		} else {
			closeMenu();
		}
	});

	menu.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', closeMenu);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeMenu();
		}
	});
}

function filterProjects(category) {
	const cards = document.querySelectorAll('.project-card');
	const buttons = document.querySelectorAll('#projectFilters button');

	buttons.forEach(btn => {
		const isActive = btn.dataset.category === category;
		btn.classList.toggle('filter-btn-active', isActive);
		btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
	});

	cards.forEach(card => {
		const matches = category === 'all' || card.getAttribute('data-category') === category;
		card.style.display = matches ? 'block' : 'none';
	});
}

function setupProjectFiltering() {
	const buttons = document.querySelectorAll('#projectFilters button');

	buttons.forEach(btn => {
		btn.addEventListener('click', () => filterProjects(btn.dataset.category || 'all'));
	});

	filterProjects('all');
}

function setupScrollAnimations() {
	const elements = document.querySelectorAll('.reveal');
	if (!elements.length) {
		return;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		elements.forEach(element => element.classList.add('is-visible'));
		return;
	}

	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				obs.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.15,
		rootMargin: '0px 0px -10% 0px'
	});

	elements.forEach(element => observer.observe(element));
}
